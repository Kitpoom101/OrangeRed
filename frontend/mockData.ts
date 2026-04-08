import { ReviewComment } from "./types";

export const MOCK_COMMENTS: ReviewComment[] = [
  {
    _id: "64f1a2b3c4d5e6f7a8b9c001",
    user: { _id: "64f1a2b3c4d5e6f7a8b9u001", name: "Natcha Wongkham" },
    shop: { _id: "64f1a2b3c4d5e6f7a8b9s001", name: "Serenity Spa" },
    reservation: "64f1a2b3c4d5e6f7a8b9r001",
    score: 5,
    review: "Absolutely wonderful experience. The staff were attentive and the atmosphere was incredibly calming.",
    createdAt: "2025-03-15T10:30:00.000Z",
  },
  {
    _id: "64f1a2b3c4d5e6f7a8b9c002",
    user: { _id: "64f1a2b3c4d5e6f7a8b9u002", name: "James Thornton" },
    shop: { _id: "64f1a2b3c4d5e6f7a8b9s001", name: "Serenity Spa" },
    reservation: "64f1a2b3c4d5e6f7a8b9r002",
    score: 4,
    review: "Great massage, very professional. Will definitely come back again. The Thai traditional was top notch.",
    createdAt: "2025-02-20T14:00:00.000Z",
  },
  {
    _id: "64f1a2b3c4d5e6f7a8b9c003",
    user: { _id: "64f1a2b3c4d5e6f7a8b9u003", name: "Siriporn Kaewmanee" },
    shop: { _id: "64f1a2b3c4d5e6f7a8b9s001", name: "Serenity Spa" },
    reservation: "64f1a2b3c4d5e6f7a8b9r003",  
    score: 5,
    review: "One of the best massage shops I have visited. Highly recommend the aromatherapy package.",
    createdAt: "2025-01-10T09:15:00.000Z",
  },
];

export const MOCK_AVG_RATING =
  Math.round((MOCK_COMMENTS.reduce((sum, c) => sum + c.score, 0) / MOCK_COMMENTS.length) * 10) / 10;

export const MOCK_REVIEW_COUNT = MOCK_COMMENTS.length;