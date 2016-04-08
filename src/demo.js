
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

export default function _demoExecute () {
  const result = [
    {text: this.verb, category: 'action'},
    {text: ' '},
    {text: this.setting.name, argument: 'setting'}
  ]

  if (this.duration) {
    result.push({text: ', wait '}, formatDuration(this.duration), {text: ', then change it back'})
  }

  return result
}