import { Movie, Show, Seat } from "../models";
import { calculateShowPrice } from "../services/pricingService";

// CREATE SHOW
export const createShow = async (
  request: any,
  reply: any
) => {
  try {
    const {
      movieId,
      showDate,
      showTime,
      price,
    } = request.body;

    if (
      !movieId ||
      !showDate ||
      !showTime ||
      !price
    ) {
      return reply.code(400).send({
        message: "All show fields are required",
      });
    }

    const movie = await Movie.findByPk(
      Number(movieId)
    );

    if (!movie) {
      return reply.code(404).send({
        message: "Movie not found",
      });
    }

    const finalPrice = calculateShowPrice(
      Number(price),
      showDate,
      showTime
    );

    const show = await Show.create({
      movieId: Number(movieId),
      showDate,
      showTime,
      price: finalPrice,
    });

    const seats = [];

    const rows = [
      "A",
      "B",
      "C",
      "D",
      "E",
    ];

    const seatsPerRow = 5;

    for (const row of rows) {
      for (
        let number = 1;
        number <= seatsPerRow;
        number++
      ) {
        seats.push({
          showId: show.get("id"),
          seatNumber: `${row}${number}`,
          status: "AVAILABLE",
        });
      }
    }

    await Seat.bulkCreate(seats);

    return reply.code(201).send({
      message: "Show created successfully",
      show,
      seatsCreated: seats.length,
    });
  } catch (error: any) {
    console.error(
      "Create show error:",
      error
    );

    return reply.code(500).send({
      message: "Failed to create show",
      error: error.message,
    });
  }
};

// GET ALL SHOWS
export const getAllShows = async (
  request: any,
  reply: any
) => {
  try {
    const shows = await Show.findAll({
      include: [
        {
          model: Movie,
          attributes: [
            "id",
            "title",
          ],
        },
      ],
      order: [
        ["showDate", "ASC"],
        ["showTime", "ASC"],
      ],
    });

    return reply.send({
      shows,
    });
  } catch (error: any) {
    console.error(
      "Get all shows error:",
      error
    );

    return reply.code(500).send({
      message: "Failed to get shows",
      error: error.message,
    });
  }
};

// GET SHOWS BY MOVIE
export const getShowsByMovie = async (
  request: any,
  reply: any
) => {
  try {
    const { movieId } = request.params;

    const shows = await Show.findAll({
      where: {
        movieId: Number(movieId),
      },
      order: [
        ["showDate", "ASC"],
        ["showTime", "ASC"],
      ],
    });

    return reply.send({
      shows,
    });
  } catch (error: any) {
    console.error(
      "Get shows by movie error:",
      error
    );

    return reply.code(500).send({
      message: "Failed to get shows",
      error: error.message,
    });
  }
};

// UPDATE SHOW
export const updateShow = async (
  request: any,
  reply: any
) => {
  try {
    const { showId } = request.params;

    const show = await Show.findByPk(
      Number(showId)
    );

    if (!show) {
      return reply.code(404).send({
        message: "Show not found",
      });
    }

    const {
      movieId,
      showDate,
      showTime,
      price,
    } = request.body;

    if (
      !movieId ||
      !showDate ||
      !showTime ||
      !price
    ) {
      return reply.code(400).send({
        message: "All show fields are required",
      });
    }

    const movie = await Movie.findByPk(
      Number(movieId)
    );

    if (!movie) {
      return reply.code(404).send({
        message: "Movie not found",
      });
    }

    const finalPrice = calculateShowPrice(
      Number(price),
      showDate,
      showTime
    );

    await show.update({
      movieId: Number(movieId),
      showDate,
      showTime,
      price: finalPrice,
    });

    return reply.send({
      message: "Show updated successfully",
      show,
    });
  } catch (error: any) {
    console.error(
      "Update show error:",
      error
    );

    return reply.code(500).send({
      message: "Failed to update show",
      error: error.message,
    });
  }
};

// DELETE SHOW
export const deleteShow = async (
  request: any,
  reply: any
) => {
  try {
    const { showId } = request.params;

    const show = await Show.findByPk(
      Number(showId)
    );

    if (!show) {
      return reply.code(404).send({
        message: "Show not found",
      });
    }

    await Seat.destroy({
      where: {
        showId: Number(showId),
      },
    });

    await show.destroy();

    return reply.send({
      message: "Show deleted successfully",
    });
  } catch (error: any) {
    console.error(
      "Delete show error:",
      error
    );

    return reply.code(500).send({
      message: "Failed to delete show",
      error: error.message,
    });
  }
};
