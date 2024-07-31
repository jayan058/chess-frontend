export class Timer {
    private currentTimerElement: HTMLElement | null;
    private pastTimerElement: HTMLElement | null;
  
    constructor(currentElementId: string, pastElementId: string) {
      this.currentTimerElement = document.getElementById(currentElementId);
      this.pastTimerElement = document.getElementById(pastElementId);
    }
  
    public updateTimerDisplay(time: number) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  
      if (this.currentTimerElement && this.pastTimerElement) {
        // Update the past timer with the current time
        this.pastTimerElement.innerText = this.currentTimerElement.innerText;
  
        // Update the current timer with the new time
        this.currentTimerElement.innerText = formattedTime;
  
        // Apply scrolling effect
        this.currentTimerElement.classList.add('scroll-up');
        this.pastTimerElement.classList.remove('scroll-down');
  
        // Reset the past timer for the next update
        setTimeout(() => {
          this.currentTimerElement!.classList.remove('scroll-up');
          this.pastTimerElement!.classList.add('scroll-down');
        }, 500); // Match the duration of the CSS transition
      }
    }
  }