import Seat from "../models/Seat";

export const unlockExpiredSeats = async () => {
  try {
    const now = new Date();

    await Seat.update(
      {
        status: "AVAILABLE",
        lockedUntil: null,
      },
      {
        where: {
          status: "LOCKED",
          lockedUntil: {
            [require("sequelize").Op.lt]: now,
          },
        },
      }
    );

    console.log("Expired seats unlocked");
  } catch (error) {
    console.error(
      "Failed to unlock expired seats:",
      error
    );
  }
};