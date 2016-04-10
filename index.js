'use strict'

const Trailpack = require('trailpack')
const _ = require('lodash')
const webpack = require('webpack')

/**
 * React Trailpack
 *
 * @class React
 *
 * Use React in your Trails application
 */
module.exports = class Hapi extends Trailpack {

  /**
   * Ensure that config/webpack is valid
   */
  validate() {
    const config = this.app.config
    const logger = this.app.config.log.logger

    if (!config.webpack.options) {
      logger.warn('trailpack-react: no Webpack "options" are defined.')
      logger.warn('trailpack-react: Please configure config/webpack.js')
    }
    return Promise.resolve()
  }

  /**
   * Start Webpack
   */
  initialize() {
    const logger = this.app.config.log.logger
    return new Promise((resolve, reject) => {
      this.compiler = webpack(this.app.config.webpack.options, (err, stats) => {
        if (err) return reject(err)

        logger.info('trailpack-react: compiler loaded.')
        logger.silly('trailpack-react: ', stats.toString())

        if (process.env.NODE_ENV == 'development') {
          logger.info('trailpack-react: watching...')
          this.compiler.watch(_.extend({}, this.app.config.webpack.watchOptions), this.afterBuild.bind(this))
        }
        else {
          logger.info('trailpack-react: running...')
          this.compiler.run(this.afterBuild.bind(this))
        }
        resolve()
      })
    })
  }

  afterBuild(err, rawStats) {
    const logger = this.app.config.log.logger
    if (err) return logger.error('trailpack-react: FATAL ERROR', err)

    const stats = rawStats.toJson()

    logger.debug('trailpack-react: Build Info\n' + rawStats.toString({
        colors: true,
        chunks: false
      }))

  }

  constructor(app, config) {
    super(app, {
      config: require('./config'),
      pkg: require('./package')
    })
  }

}
