import Notification from "../models/notification";
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });
    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notification);
  } catch (error) {
    console.log("Erorr in notification function ", error.message);
    res.status(500).json({ error: "Internal server erorr" });
  }
};
export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in delete notifications function", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotificationById = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      to: userId,
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in delete notification by id function", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
