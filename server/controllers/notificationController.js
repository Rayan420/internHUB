const { da } = require('date-fns/locale');
const prisma = require('../prisma');

const getNotifications = async (req, res) => {
    const userId = parseInt(req.params.userId);

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: userId
            }
        });
        if (!notifications) {
            return res.status(202).json({ error: "No notifications found" });
        }
        return res.status(200).json({ notifications });
    }
    catch (error) {
        console.error("Error getting notifications", error);
        return res.status(500).json({ error: "An error occurred while getting the notifications" });
    }
    
};

const readNotifications = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const notificationId = parseInt(req.params.notificationId);
    try {
      const notifications = await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId: userId,
        },
        data: {
          read: true,
        },
      });
      if (!notifications) {
        return res.status(202).json({ error: "No notifications found" });
      }
      return res.status(200).json({ notifications });
    } catch (error) {
      console.error("Error updating notification", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the notification" });
    }
  };
  




module.exports = { getNotifications, readNotifications };