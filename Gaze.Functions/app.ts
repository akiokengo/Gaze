import debug = require('debug');
import express = require('express');

import routes from './routes/index';

var app = express();

app.use('/', routes);
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
