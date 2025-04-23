class Sound {
    #audio;

    constructor(audioFilePath) {
        this.#audio = new Audio(audioFilePath);
    }

    play() {
        this.#audio.currentTime = 0;
        this.#audio.play();
    }

    playInLoop() {
        this.#audio.loop = true;
        this.play();
    }

    stop() {
        this.#audio.loop = false;
        this.#audio.pause();
    }
}

