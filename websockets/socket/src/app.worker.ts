export default () => {
  self.addEventListener("message", (e) => {
    if (!e) return;
    let { start , end , type } = e.data;
    if(type === "add"){
        var sum = start;
        for(let i = start;i<end;i++){
            sum += i;
        }
        postMessage(sum);
    }
    else {
        var diff = end - start
        postMessage(diff);
    }
  });
};
