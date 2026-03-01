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

    let deletedCount = 0;
    let lockedCount = 0;

    for (const item of stickiesToDelete) {
      try {
        await board.remove(item);
        deletedCount++;
      } catch (err) {
        if (err.message?.includes("locking")) {
          lockedCount++;
        } else {
          throw err;
        }
      }
    }

    await miro.board.deselect();

    if (deletedCount > 0 && lockedCount === 0) {
      await miro.board.notifications.showInfo(
        `✅${deletedCount} sticky note${deletedCount === 1 ? " was" : "s were"} successfully deleted!`
      );
    } else if (deletedCount > 0 && lockedCount > 0) {
      await miro.board.notifications.showInfo(
        `${deletedCount} sticky note${deletedCount === 1 ? " was" : "s were"} deleted, but ${lockedCount} ${lockedCount === 1 ? "was" : "were"} locked and could not be removed.`
      );
    } else if (lockedCount > 0) {
      await miro.board.notifications.showError(
        `${lockedCount} sticky note${lockedCount === 1 ? " is" : "s are"} locked and could not be deleted.`
      );
    }

  } catch (error) {
    console.error("Error executing Delete Empty Stickies:", error);
    await miro.board.notifications.showError("An error occurred while trying to delete empty sticky notes.");
  }
};