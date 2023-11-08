let vid = 0
function IM_GREAT(){
document.querySelector("tbody").children[vid].click();
setTimeout(()=>{
    let video = document.querySelector("video");
    video.play();
    video.playbackRate = 2;
    video.addEventListener('ended',()=>{
    document.querySelector("button.font-normal.font-content.cursor-pointer.rounded-20.flex.items-center.justify-center.p-0.whitespace-nowrap.bg-none.text-black.flex.items-center").click()
    vid+=1;
  IM_GREAT()    

})
    },2000)

}
IM_GREAT()