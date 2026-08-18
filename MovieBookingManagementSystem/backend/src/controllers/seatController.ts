import { Seat } from "../models";

export const getSeatsByShow = async (
  request: any,
  reply: any
) => {
  try {
    const { showId } = request.params;

    const seats = await Seat.findAll({
      where: {
        showId,
      },
      order: [["seatNumber", "ASC"]],
    });

    return reply.send({
      seats,
    });
  } catch (error) {
    console.error("Get seats error:", error);

    return reply.code(500).send({
      message: "Failed to get seats",
    });
  }
};