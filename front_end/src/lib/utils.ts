import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMessageTime(dateString: string, localeCode: string = 'en'): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const locale = localeCode === 'vi' ? vi : enUS;

    if (isToday(date)) {
      return format(date, 'p', { locale });
    }
    if (isYesterday(date)) {
      return localeCode === 'vi' ? 'Hôm qua' : 'Yesterday';
    }
    return format(date, 'MMM d', { locale });
  } catch (error) {
    return '';
  }
}

export function formatDetailedTime(dateString: string, localeCode: string = 'en'): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const locale = localeCode === 'vi' ? vi : enUS;
    return format(date, "PPP 'at' p", { locale });
  } catch (error) {
    return '';
  }
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

