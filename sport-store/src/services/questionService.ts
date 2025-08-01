import apiClient from '../lib/apiClient';
import type { Question, QuestionResponse } from '../types/api';

export interface CreateQuestionData {
  productSku: string;
  question: string;
}

export interface SingleQuestionResponse {
  success: boolean;
  message: string;
  data: {
    question: Question;
  };
}

export async function getQuestions({ page = 1, limit = 10, status = '', productSku = '' }: { page?: number; limit?: number; status?: string; productSku?: string }) {
  const response = await apiClient.get<QuestionResponse>(`/api/questions`, {
    params: { page, limit, status, productSku }
  });
  return response.data;
}

export async function getUserQuestions(userId: string) {
  const response = await apiClient.get<QuestionResponse>(`/api/questions/user/${userId}`);
  return response.data;
}

export async function createQuestion(data: any) {
  const response = await apiClient.post<SingleQuestionResponse>(`/api/questions`, data);
  return response.data;
}

export async function deleteQuestion(questionId: string) {
  const response = await apiClient.delete<QuestionResponse>(`/api/questions/${questionId}`);
  return response.data;
}

export async function markQuestionHelpful(questionId: string) {
  const response = await apiClient.post<{ success: boolean; message: string; data: { isHelpful: number } }>(`/api/questions/helpful/${questionId}`);
  return response.data;
}

export async function getPendingQuestions(
    page: number = 1,
    limit: number = 10
  ) {
    const response = await apiClient.get<QuestionResponse>(`/api/questions/admin/pending`, {
      params: { page, limit }
    });
    return response.data;
  }

export async function approveQuestion(questionId: string) {
  const response = await apiClient.put<{ success: boolean; message: string }>(`/api/questions/admin/${questionId}/approve`);
  return response.data;
}

export async function rejectQuestion(questionId: string) {
  const response = await apiClient.put<{ success: boolean; message: string }>(`/api/questions/admin/${questionId}/reject`);
  return response.data;
}

export async function answerQuestion(
    questionId: string,
    answer: string
  ) {
    const response = await apiClient.put<{ success: boolean; message: string }>(`/api/questions/admin/${questionId}/answer`, {
      answer
    });
    return response.data;
  }

export async function verifyQuestion(questionId: string) {
  const response = await apiClient.put<{ success: boolean; message: string }>(`/api/questions/admin/${questionId}/verify`);
  return response.data;
} 