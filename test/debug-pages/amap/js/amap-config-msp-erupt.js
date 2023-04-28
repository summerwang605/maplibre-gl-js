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

amapgl.config.API_URL = api_config.url;
amapgl.config.TRAFFIC_SOURCE = api_config.traffic_source;
amapgl.config.TRAFFIC_SOURCE = api_config.traffic_source;
amapgl.config.API_URL_EVENTS = api_config.events_url;
amapgl.config.API_URL_SESSION = api_config.session;
amapgl.config.API_URL_FEEDBACK = api_config.feedback;

amapgl.config.REPORT_MAP_EVENTS = api_config.report_map_events;
amapgl.config.REPORT_MAP_SESSION = api_config.report_map_session;

amapgl.config.DEBUG = true;
amapgl.accessToken='amap_token';
console.log(amapgl.config);
