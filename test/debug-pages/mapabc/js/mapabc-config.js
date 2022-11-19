var api_config = {
    "traffic_source": {
        "raster": {
            "tiles": ["http://114.215.68.185:8883/img/?t={z}-{x}-{y}"], "tileSize": "256", "type": "raster"
        }, "vector": {"tiles": ["http://114.215.68.185:8883/amptraffic?t={z}-{x}-{y}"], "type": "vector"}
    },
    "url": "https://api.mapbox.com",
    "events_url": "/events/v2",
    "session": "/map-sessions/v1",
    "feedback": "/feedback"
};
api_config = {
    "traffic_source": {
        "raster": {
            "tiles": ["http://121.36.99.212:8883/img?t={z}-{x}-{y}"], "tileSize": "256", "type": "raster"
        }, "vector": {"tiles": ["http://121.36.99.212:8883/amptraffic?t={z}-{x}-{y}"], "type": "vector"}
    }, "url": "http://121.36.99.212:35001"
};

mapabcgl.config.API_URL = api_config.url;
mapabcgl.config.TRAFFIC_SOURCE = api_config.traffic_source;
mapabcgl.config.TRAFFIC_SOURCE = api_config.traffic_source;
mapabcgl.config.API_URL_EVENTS = api_config.events_url;
mapabcgl.config.API_URL_SESSION = api_config.session;
mapabcgl.config.API_URL_FEEDBACK = api_config.feedback;

mapabcgl.config.REPORT_MAP_EVENTS = true;
mapabcgl.config.REPORT_MAP_SESSION = true;

mapabcgl.config.DEBUG = true;
mapabcgl.accessToken = 'pk.eyJ1IjoiY2FpcGVpeXVhbiIsImEiOiJjamZ0aDY4YjIwOG5zMzBsNmdwbnFjbHg3In0.p9Mnm9HmZvc8zSFzE4peQw';
console.log(mapabcgl.config);
