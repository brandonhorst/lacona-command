import _ from 'lodash'

function andify (array, separator = ', ') {
  if (array.length === 1) {
    return array
  } else if (array.length === 2) {
    return [array[0], {text: ' and '}, array[1]]
  } else {
    return _.chain(array)
      .slice(0, -2)
      .map(item => [item, {text: separator}])
      .flatten()
      .concat(_.slice(array, -2, -1)[0])
      .concat({text: `${separator}and `})
      .concat(_.slice(array, -1)[0])
      .value()
  }
}

function formatDuration ({hours, minutes, seconds}) {
  let text
  if (hours && minutes && seconds) {
    text = `${hours} hours, ${minutes} minutes, and ${seconds} seconds`
  } else if (hours && minutes) {
    text = `${hours} hours and ${minutes} minutes`
  } else if (hours && seconds) {
    text = `${hours} hours and ${seconds} seconds`
  } else if (minutes && seconds) {
    text = `${minutes} minutes and ${seconds} seconds`
  } else if (hours) {
    text = `${hours} hours`
  } else if (minutes) {
    text = `${minutes} minutes`
  } else if (seconds) {
    text = `${seconds} seconds`
  }

  return {text, argument: 'time duration'}
}

export default function demoExecute (result) {
  const settings = result.settings.map(setting => {
    return {text: setting.name, argument: 'setting'}
  })

  const output = _.flatten([
    {text: result.verb, category: 'action'},
    {text: ' '},
    andify(settings)
  ])

  if (result.duration) {
    output.push({text: ', wait '}, formatDuration(result.duration), {text: ', then change it back'})
  }

  return output
}