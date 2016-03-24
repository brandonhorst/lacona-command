/** @jsx createElement */

import moment from 'moment'
import { createElement } from 'elliptical'
import { TimeDuration } from 'elliptical-datetime'

export const Command = {
  mapResult (result, element) {
    return {result, element}
  },
  describe () {
    return null
  }
}

export const BooleanSetting = {
  describe () {
    return null
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

class BooleanSettingCommandObject {
  constructor ({verb, setting, duration}) {
    this.verb = verb
    this.setting = setting
    this.duration = duration
  }

  setSetting (invert = false) {
    if (this.verb === 'enable' || this.verb === 'disable' && invert) {
      this.setting.enable()
    } else if (this.verb === 'disable' || this.verb === 'enable' && invert) {
      this.setting.disable()
    } else if (this.verb === 'toggle') {
      this.setting.toggle()
    }
  }

  _demoExecute () {
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

  execute () {
    if (this.duration) {
      const ms = moment.duration(this.duration).asMilliseconds()
      global.setTimeout(this.setSetting.bind(this, true), ms)
    }
    
    this.setSetting()
  }
}

export const BooleanSettingCommand = {
  extends: [Command],
  mapResult (result) {
    return new BooleanSettingCommandObject(result)
  },
  describe () {
    return (
      <sequence>
        <list items={[
          {text: 'disable ', value: 'disable'},
          {text: 'enable ', value: 'enable'},
          {text: 'toggle ', value: 'toggle'},
          {text: 'turn off ', value: 'disable'},
          {text: 'turn on ', value: 'enable'}
        ]} limit={3} category='action' id='verb' />
        <BooleanSetting id='setting' />
        <sequence optional id='duration'>
          <literal text=' for ' category='conjunction' />
          <TimeDuration merge />
        </sequence>
      </sequence>
    )
  }
}

export const extensions = [BooleanSettingCommand]
