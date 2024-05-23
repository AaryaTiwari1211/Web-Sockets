class WebWorker extends Worker {
    constructor(worker: () => void) {
        const code = worker.toString();
        const blob = new Blob(["(" + code + ")()"]);
        super(URL.createObjectURL(blob));
    }
}

export default WebWorker;