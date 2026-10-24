module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ ok: true, time: Date.now() }));
};
