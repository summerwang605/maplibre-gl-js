var api_config = {
    "traffic_source": {
        "raster": {
            "tiles": ["http://114.215.68.185:8883/img/?t={z}-{x}-{y}"],
            "tileSize": "256",
            "type": "raster"
        },
        "vector": {"tiles": ["http://114.215.68.185:8883/amptraffic?t={z}-{x}-{y}"], "type": "vector"}
    },
    "url": "http://192.168.2.111:35001/msp/msp-api",
    "events_url":"/events/v2",
    "session":"/map-sessions/v1",
    "feedback":"/feedback",
    "report_map_events": false,
    "report_map_session": false
};

mapabcgl.config.API_URL = api_config.url;
mapabcgl.config.TRAFFIC_SOURCE = api_config.traffic_source;
mapabcgl.config.TRAFFIC_SOURCE = api_config.traffic_source;
mapabcgl.config.API_URL_EVENTS = api_config.events_url;
mapabcgl.config.API_URL_SESSION = api_config.session;
mapabcgl.config.API_URL_FEEDBACK = api_config.feedback;

mapabcgl.config.REPORT_MAP_EVENTS = api_config.report_map_events;
mapabcgl.config.REPORT_MAP_SESSION = api_config.report_map_session;

mapabcgl.config.DEBUG = true;
mapabcgl.accessToken='mapabc_token';
console.log(mapabcgl.config);
