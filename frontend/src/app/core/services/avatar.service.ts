import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  
  /**
   * Get a default avatar URL using UI Avatars service
   * @param name - Name to display in avatar
   * @param size - Size of avatar (default 200)
   * @returns URL to avatar image
   */
  getDefaultAvatar(name: string = 'User', size: number = 200): string {
    const cleanName = name.trim() || 'User';
    const initials = this.getInitials(cleanName);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=667eea&color=fff&bold=true`;
  }

  /**
   * Get avatar URL with fallback to default
   * @param url - Profile picture URL
   * @param name - User name for default avatar
   * @returns Valid avatar URL
   */
  getAvatarUrl(url: string | null | undefined, name: string = 'User'): string {
    if (url && url.trim() && !url.includes('avatar.png')) {
      return url;
    }
    return this.getDefaultAvatar(name);
  }

  /**
   * Extract initials from full name
   * @param name - Full name
   * @returns Initials (max 2 characters)
   */
  private getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * Handle image error by setting fallback
   * @param event - Image error event
   * @param name - User name for fallback
   */
  handleImageError(event: Event, name: string = 'User'): void {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('ui-avatars.com')) {
      img.src = this.getDefaultAvatar(name);
    }
  }
}
