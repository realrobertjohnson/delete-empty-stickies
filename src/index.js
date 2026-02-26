import { deleteEmptyStickies } from "./deleteEmptyStickies";

const init = () => {
  const { board } = window.miro;

  board.ui.on("icon:click", async () => {
    //await deleteEmptyStickies();
    deleteEmptyStickies();
  });
};


init();