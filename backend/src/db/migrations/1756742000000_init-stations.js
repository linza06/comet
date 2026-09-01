exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createExtension("postgis", { ifNotExists: true });

  pgm.createTable("stations", {
    id: "id",
    name: { type: "text", notNull: true },
    line: { type: "text" },
    city: { type: "text", notNull: true, default: "Kochi" },
    geom: { type: "geography(Point, 4326)", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("now()")
    }
  });

  pgm.createIndex("stations", "geom", { method: "gist" });
};

exports.down = (pgm) => {
  pgm.dropTable("stations");
};
