import Service from '../models/Service.js';
import { HttpError } from '../utils/httpError.js';
import { getStudyRecommendations } from '../services/aiService.js';

const MIN_LENGTH = 10;
const MAX_LENGTH = 1000;

// POST /api/ai/recommend (logged in)
export const recommendServices = async (req, res) => {
  const problem = typeof req.body?.problem === 'string' ? req.body.problem.trim() : '';

  if (problem.length < MIN_LENGTH) {
    throw new HttpError(400, 'Tell the advisor a bit more about what you need help with.');
  }
  if (problem.length > MAX_LENGTH) {
    throw new HttpError(400, `Please keep your message under ${MAX_LENGTH} characters.`);
  }

  const services = await Service.find({ isActive: true });
  if (services.length === 0) {
    throw new HttpError(503, 'There are no tutoring services to recommend right now.');
  }

  const aiResult = await getStudyRecommendations({ problem, services });
  if (
    !aiResult ||
    typeof aiResult.summary !== 'string' ||
    typeof aiResult.studyTip !== 'string' ||
    !Array.isArray(aiResult.recommendations)
  ) {
    throw new HttpError(502, 'The AI Advisor gave an unexpected answer. Please try again.');
  }

  const servicesById = new Map(services.map((service) => [service._id.toString(), service]));
  const seen = new Set();

  const recommendations = aiResult.recommendations
    .filter((recommendation) => {
      if (
        !recommendation ||
        typeof recommendation.serviceId !== 'string' ||
        !['strong', 'good'].includes(recommendation.matchLevel) ||
        typeof recommendation.reason !== 'string' ||
        !servicesById.has(recommendation.serviceId) ||
        seen.has(recommendation.serviceId)
      ) {
        return false;
      }
      seen.add(recommendation.serviceId);
      return true;
    })
    .slice(0, 3)
    .map((recommendation) => ({
      service: servicesById.get(recommendation.serviceId),
      matchLevel: recommendation.matchLevel,
      reason: recommendation.reason,
    }));

  res.json({
    summary: aiResult.summary,
    studyTip: aiResult.studyTip,
    recommendations,
  });
};
