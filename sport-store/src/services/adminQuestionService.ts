import apiClient from '../lib/apiClient';
import type { AdminQuestion, AdminQuestionResponse, AnswerQuestionData } from '../types/api';

export async function getAdminQuestions(params: any) {
  const response = await apiClient.get<AdminQuestionResponse>(`/api/admin/questions`, { params });
  return response.data;
}

export async function answerQuestion(questionId: string, data: AnswerQuestionData) {
  const response = await apiClient.put<AdminQuestionResponse>(`/api/admin/questions/${questionId}/answer`, data);
  return response.data;
}

export async function verifyQuestion(questionId: string) {
  const response = await apiClient.put<AdminQuestionResponse>(`/api/admin/questions/${questionId}/verify`);
  return response.data;
}

export async function deleteQuestion(questionId: string) {
  const response = await apiClient.delete<AdminQuestionResponse>(`/api/admin/questions/${questionId}`);
  return response.data;
} 