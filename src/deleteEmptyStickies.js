const { board } = window.miro;

export const deleteEmptyStickies = async () => {
  try {
    const selectedWidgets = await board.getSelection();

    if (selectedWidgets.length === 0) {
      await miro.board.notifications.showError("No objects selected. Select something and try again.");
      return;
    }

    const selectedStickies = selectedWidgets.filter((item) => item.type === "sticky_note");

    if (selectedStickies.length === 0) {
      await miro.board.notifications.showError("No sticky notes were selected. Select at least one sticky note and try again.");
      return;
    }

    const stickiesToDelete = selectedStickies.filter((item) => {
      return (item.content ?? "")
        .replace(/<[^>]*>/g, "")        // strip HTML tags
        .replace(/&[a-z]+;/gi, "")      // strip any HTML entities
        .replace(/&#\d+;/g, "")         // strip numeric entities
        .trim() === "";
    });

    if (stickiesToDelete.length === 0) {
      await miro.board.notifications.showInfo("No empty sticky notes found in the selection.");
      return;
    }

    await Promise.all(stickiesToDelete.map((item) => board.remove(item)));

    await miro.board.deselect();

    await miro.board.notifications.showInfo(
      `${stickiesToDelete.length} sticky note${stickiesToDelete.length === 1 ? " was" : "s were"} successfully deleted!`
    );

  } catch (error) {
    console.error("Error executing Delete Empty Stickies:", error);
    await miro.board.notifications.showError("An error occurred while trying to delete empty sticky notes.");
  }
};