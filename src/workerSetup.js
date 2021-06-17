
export default class WebWorker {
    constructor(worker) {
      const code = worker.toString();
      //console.log('WEB CODE',code);
      const blob = new Blob(["(" + code + ")()"]);
      console.log('Blob',blob);
      return new Worker(URL.createObjectURL(blob));
    }
  }