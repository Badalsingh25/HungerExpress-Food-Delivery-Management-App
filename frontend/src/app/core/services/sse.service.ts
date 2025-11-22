import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SseService {
  constructor(private zone: NgZone){}

  connect(url: string, onMessage: (ev: MessageEvent) => void){
    const es = new EventSource(url);
    es.onmessage = (e) => this.zone.run(() => onMessage(e));
    es.addEventListener('orders:update', (e: any) => this.zone.run(() => onMessage(e)));
    return () => es.close();
  }
}
