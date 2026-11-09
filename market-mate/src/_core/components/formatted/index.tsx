import {emptyUom} from '@core/constants/texts';
import type {DateLikewise, DictOf, IdValue} from '@core/types';
import {getSetValues} from '@core/utils/arrays';
import {distanceInSecs} from '@core/utils/dates';
import {parseDecimal} from '@core/utils/numbers';
import {FormattedDate, FormattedNumber, FormattedRelativeTime, FormattedTime} from 'react-intl';
import Stack from 'rsuite/Stack';
import Tooltip from 'rsuite/Tooltip';
import Whisper from 'rsuite/Whisper';

import {Icon, IconName} from '../icon';

type NumberValueProps = {
  value?: number;
};

export const NumberValue = ({value}: NumberValueProps) => (
  <FormattedNumber
    value={value ?? 0}
    minimumFractionDigits={(value ?? 0) % 1 === 0 ? 0 : 2}
    maximumFractionDigits={(value ?? 0) % 1 === 0 ? 0 : 2}
  />
);

type MeasurementValueProps = NumberValueProps & {
  uom?: string;
  suffix?: boolean;
};

export const MeasurementValue = ({value, uom, suffix = false}: MeasurementValueProps) => {
  return (
    <>
      {suffix && <span className="me-1">{uom ?? emptyUom}</span>}
      <NumberValue value={parseDecimal(`${value ?? 0}`)} />
      {!suffix && <span className="ms-1">{uom ?? emptyUom}</span>}
    </>
  );
};

type DateValueProps = {
  value?: DateLikewise;
  inline?: boolean;
  relative?: boolean;
};

export const DateValue = ({value}: DateValueProps) =>
  value ? <FormattedDate value={value} year="numeric" month="short" day="numeric" /> : '';

export const TimeValue = ({value}: DateValueProps) =>
  value ? <FormattedTime value={value} hour="2-digit" minute="2-digit" timeZoneName="short" /> : '';

export const RelativeTimeValue = ({value}: DateValueProps) =>
  value ? <FormattedRelativeTime value={distanceInSecs(value)} updateIntervalInSeconds={1} /> : '';

export const DateTimeValue = ({value, inline, relative}: DateValueProps) =>
  value ? (
    <>
      <DateValue value={value} />
      <span className={inline ? 'ms-1' : 'd-block'}>
        <TimeValue value={value} />
      </span>
      {relative ? (
        <span className={inline ? 'ms-2' : 'd-block'}>
          <RelativeTimeValue value={value} />
        </span>
      ) : (
        ''
      )}
    </>
  ) : (
    ''
  );

type Tag = {
  key: IdValue;
  icon?: string;
  mode?: string;
};

type TaggedNumberValueProps = {
  tag: Tag;
  value: number;
};

export const TaggedNumberValue = ({tag, value}: TaggedNumberValueProps) => {
  return (
    <span className={`value-container ${tag?.mode}`}>
      <NumberValue value={value} />
      <Icon name={tag.icon} className="ms-2" />
    </span>
  );
};

type TaggedNumberValuesProps = {
  tags: Tag[];
  values: DictOf<number>;
};

export const TaggedNumberValues = ({tags, values}: TaggedNumberValuesProps) => {
  return (
    <Stack justifyContent="center" spacing={6}>
      {tags.map(tag => (
        <Stack.Item key={tag.key}>
          <TaggedNumberValue tag={tag} value={values[tag.key]} />
        </Stack.Item>
      ))}
    </Stack>
  );
};

type CoordinatesProps = {
  latitude?: number;
  longitude?: number;
};

export const CoordinatesValue = ({latitude, longitude}: CoordinatesProps) => {
  if (latitude == null || longitude == null) {
    return '';
  }

  const openingBracket = '[';
  const closingBracket = ']';
  const comma = ',';

  return (
    <span>
      <Icon name={IconName.Coordinates} className="me-1" />
      <span>{openingBracket}</span>
      <FormattedNumber value={latitude} minimumFractionDigits={6} maximumFractionDigits={6} />
      <span>{comma} </span>
      <FormattedNumber value={longitude} minimumFractionDigits={6} maximumFractionDigits={6} />
      <span>{closingBracket}</span>
    </span>
  );
};

type NamesProps = {
  value: string[];
};

export const ListValues = ({value}: NamesProps) => {
  const set = new Set(value);
  const text = getSetValues(set);

  if (set.size < 2) {
    return <p className="value">{text}</p>;
  }

  const speaker = (
    <Tooltip arrow={false}>
      {[...set].map(val => (
        <div key={val}>{val}</div>
      ))}
    </Tooltip>
  );

  return (
    <Whisper followCursor speaker={speaker}>
      <p className="value">{text}</p>
    </Whisper>
  );
};
