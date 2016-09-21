const renderer = (viewTree) => {
  viewTree.subscribe(x => console.log(x));
}

export default renderer;
