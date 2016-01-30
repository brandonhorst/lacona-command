/** @jsx createElement */

import moment from 'moment'
import { Phrase, createElement } from 'lacona-phrase'
import { TimeDuration } from 'lacona-phrase-datetime'

export class Command extends Phrase {
  describe () {
    return null
  }
}

export class BooleanSetting extends Phrase {
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

export class BooleanSettingCommand extends Phrase {
  static extends = [Command]

  describe () {
    return (
      <map function={result => new BooleanSettingCommandObject(result)}>
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
      </map>
    )
  }
}

export const extensions = [BooleanSettingCommand]
