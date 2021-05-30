import moment from 'moment'

const formatDate = function (time) {
    return moment.unix(time).utc()
}

export {
  formatDate
}