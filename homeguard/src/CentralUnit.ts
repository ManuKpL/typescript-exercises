import { AudibleAlarm } from './AudibleAlarm';
import { HomeGuardView } from './HomeGuardView';
import { Sensor } from './Sensor';
import { TextAudibleAlarm } from './TextAudibleAlarm';
import { TextView } from './TextView';

export class CentralUnit {
  // sensor test status options
  public static readonly PASS: string = 'PASS';
  public static readonly FAIL: string = 'FAIL';
  public static readonly PENDING: string = 'pending';
  public static readonly READY: string = 'ready';

  private armed: boolean = false;
  private securityCode: string = '';
  private sensors: Set<Sensor> = new Set();
  private view: HomeGuardView = new TextView();
  private audibleAlarm: AudibleAlarm = new TextAudibleAlarm();

  // members to help with sensor tests
  private sensorTestStatusMap: Map<string, string> = new Map();
  private runningSensorTest: boolean = false;
  private sensorTestStatus: string = 'PENDING';

  public isArmed(): boolean {
    return this.armed;
  }

  public arm(): void {
    this.armed = true;
  }

  public setSecurityCode(code: string): void {
    this.securityCode = code;
  }

  public isValidCode(code: string): boolean {
    return this.securityCode === code;
  }

  public enterCode(code: string): void {
    if (this.isValidCode(code)) {
      this.armed = false;
      this.audibleAlarm.silence();
    }
  }

  public audibleAlarmIsOn(): boolean {
    return false;
  }

  public getSensors(): Set<Sensor> {
    return this.sensors;
  }

  public registerSensor(sensor: Sensor): void {
    this.sensors.add(sensor);
  }

  public setView(view: HomeGuardView): void {
    this.view = view;
  }

  public setAudibleAlarm(alarm: AudibleAlarm): void {
    this.audibleAlarm = alarm;
  }

  public parseRadioBroadcast(packet: string): void {
    //parse the packet
    const tokens: string[] = packet.split(',');
    const id: string = tokens[0];
    const status: string = tokens[1];

    // find sensor with id
    let sensor: Sensor | null = null;
    for (const s of this.sensors.values()) {
      if (s.getId() === id) {
        sensor = s;
        break;
      }
    }

    //trip or reset sensor
    if (sensor !== null) {
      if ('TRIPPED' === status) sensor.trip();
      else sensor.reset();
    }

    //get the message from the sensor and display it
    const message: string = this.getSensorMessage(sensor as Sensor);
    this.view.showMessage(message);

    // sound the alarm if armed
    if (this.isArmed()) this.audibleAlarm.sound();

    // check if a sensor test is running and adjust status
    if (this.runningSensorTest) {
      if ('TRIPPED' === status) {
        this.sensorTestStatusMap.set(id, CentralUnit.PASS);
      }

      // check to see if test is complete
      let done: boolean = true;
      for (const testStatus of this.sensorTestStatusMap.values()) {
        if (CentralUnit.PENDING === testStatus) {
          done = false;
          break;
        }
      }

      //terminate test if complete
      if (done) this.terminateSensorTest();
    }
  }

  public runSensorTest(): void {
    this.runningSensorTest = true;
    this.sensorTestStatus = CentralUnit.PENDING;

    // initialize the status map
    this.sensorTestStatusMap = new Map();
    for (const sensor of this.sensors.values()) {
      this.sensorTestStatusMap.set(sensor.getId(), CentralUnit.PENDING);
    }
  }

  // used during sensor test
  public terminateSensorTest(): void {
    this.runningSensorTest = false;

    // look at individual sensor status to determine the overall test status
    this.sensorTestStatus = CentralUnit.PASS;
    for (const status of this.sensorTestStatusMap.values()) {
      if (status === CentralUnit.PENDING) {
        this.sensorTestStatus = CentralUnit.FAIL;
        break;
      }
    }
  }

  // used during sensor test
  public getSesnsorTestStatus(): string {
    return this.sensorTestStatus;
  }

  // used during sensor test
  public getSensorTestStatusMap(): Map<string, string> {
    return this.sensorTestStatusMap;
  }

  public getSensorMessage(sensor: Sensor): string {
    const message: string = 'default';
    if (!sensor.isTripped()) {
      if (sensor.getType() === Sensor.DOOR) return sensor.getLocation() + ' is closed';
      else if (sensor.getType() === Sensor.WINDOW) return sensor.getLocation() + ' is sealed';
      else if (sensor.getType() === Sensor.MOTION) return sensor.getLocation() + ' is motionless';
      else if (sensor.getType() === Sensor.FIRE) return sensor.getLocation() + ' temperature is normal';
    } else {
      if (sensor.getType() === Sensor.DOOR) return sensor.getLocation() + ' is open';
      else if (sensor.getType() === Sensor.WINDOW) return sensor.getLocation() + ' is ajar';
      else if (sensor.getType() === Sensor.MOTION) return 'Motion detected in ' + sensor.getLocation();
      else if (sensor.getType() === Sensor.FIRE) return sensor.getLocation() + ' is on FIRE!';
    }
    return message;
  }
}
