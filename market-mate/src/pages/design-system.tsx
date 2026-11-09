import {ActionsList} from '@core/components/actions-list';
import {AlertIcon} from '@core/components/alert-icon';
import {Badge} from '@core/components/badge';
import {HorizontalBarChart, VerticalBarChart} from '@core/components/charts/bar';
import {HorizontalLineChart, VerticalLineChart} from '@core/components/charts/line';
import {DoughnutChart, PieChart} from '@core/components/charts/pie';
import {Field} from '@core/components/fields';
import {FilterButton} from '@core/components/filter-button';
import {FilterByDate} from '@core/components/filter-button/by-date';
import {DayPicker} from '@core/components/filter-button/by-date/day-picker';
import {MonthPicker} from '@core/components/filter-button/by-date/month-picker';
import {RangePicker} from '@core/components/filter-button/by-date/range-picker';
import Forbidden from '@core/components/forbidden';
import {
  BooleanSelectField,
  CheckboxGroupField,
  DatePickerField,
  InputField,
  InputNumberField,
  PictureField,
  RadioGroupField,
  SelectField,
  TextAreaField,
  ToggleField,
  WeekSelectField,
} from '@core/components/form/field';
import {AutoCompleteField} from '@core/components/form/field/auto-complete';
import {MultiForm} from '@core/components/form/multi';
import {Complete} from '@core/components/form/multi/complete';
import {RowError} from '@core/components/form/multi/error';
import type {SingleFormProps} from '@core/components/form/multi/types';
import SearchInput from '@core/components/form/search';
import {WizardForm} from '@core/components/form/wizard';
import {
  CoordinatesValue,
  DateTimeValue,
  DateValue,
  ListValues,
  MeasurementValue,
  NumberValue,
  RelativeTimeValue,
  TaggedNumberValue,
  TaggedNumberValues,
  TimeValue,
} from '@core/components/formatted';
import {Icon, IconName} from '@core/components/icon';
import {InitialsAvatar} from '@core/components/initials-avatar';
import IsLoading from '@core/components/is-loading';
import NotFound from '@core/components/not-found';
import {Picture} from '@core/components/picture';
import {TabbedPanel} from '@core/components/tab-panel';
import TableView from '@core/components/table';
import Empty from '@core/components/table/empty';
import {ExportButton} from '@core/components/table/export-button';
import {Pagination} from '@core/components/table/pagination';
import {Toast} from '@core/components/toast';
import {ToastMode, ToastTag} from '@core/components/toast/types';
import {WeekFilter} from '@core/components/week-filter';
import Wip from '@core/components/wip';
import {type FiltersState, getInitialFiltersState} from '@core/types/filters';
import React from 'react';
import {defineMessage} from 'react-intl';
import Form from 'rsuite/Form';
import * as yup from 'yup';

const sampleDate = new Date(2026, 10, 7, 9, 30);

const chartData = [
  {name: 'Mon', product: 12},
  {name: 'Tue', product: 18},
  {name: 'Wed', product: 9},
  {name: 'Thu', product: 15},
];

const chartSeries = [{key: 'product', dataKey: 'product', fill: '#5c7a3a', stroke: '#5c7a3a'}];
const pieData = [
  {name: 'Idle', value: 8},
  {name: 'High Value', value: 14},
  {name: 'Low Value', value: 3},
];

const samplePicture =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#b9cc81"/></svg>',
  );

const tableHeaders = [
  {dataKey: 'name', label: 'Name'},
  {dataKey: 'products', label: 'Products', valueType: 'number'},
];

const tableRows = [
  {id: 1, name: 'Ada', products: 4, searchableTerms: ['Ada', '4']},
  {id: 2, name: 'Bola', products: 7, searchableTerms: ['Bola', '7']},
];

const sections = [
  ['actions', 'Actions'],
  ['alerts', 'Alerts'],
  ['badges', 'Badges'],
  ['charts', 'Charts'],
  ['fields', 'Fields'],
  ['filters', 'Filters'],
  ['forms', 'Forms'],
  ['formatted', 'Formatted values'],
  ['icons', 'Icons'],
  ['states', 'States'],
  ['panels', 'Panels'],
  ['table', 'Table'],
  ['toast', 'Toast'],
] as const;

type Person = {
  name: string;
};

const personHeaders: Array<keyof Person> = ['name'];

class SampleBoundary extends React.Component<React.PropsWithChildren, {error: unknown}> {
  state = {error: null};

  static getDerivedStateFromError(error: unknown) {
    return {error};
  }

  render() {
    if (this.state.error) {
      return <p>This sample could not render here.</p>;
    }
    return this.props.children;
  }
}

function Section({id, title, children}: React.PropsWithChildren<{id: string; title: string}>) {
  return (
    <section className="ds-section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function SampleSingleForm({record, onSave, onCancel}: SingleFormProps<Person>) {
  return (
    <div>
      <p>{record?.name ?? 'New person'}</p>
      <button type="button" onClick={() => onSave({name: record?.name ?? 'Ada'})}>
        Save
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

function WizardStep() {
  return <p>Tell us the product name, then continue.</p>;
}

const wizardSchema = yup.object({});

function TabOne() {
  return <p>Overview tab</p>;
}

function TabTwo() {
  return <p>Details tab</p>;
}

function FiltersSample() {
  const [filters, setFilters] = React.useState(getInitialFiltersState);

  const onChange = (key: keyof FiltersState, value: FiltersState[keyof FiltersState]) =>
    setFilters(current => ({...current, [key]: value}));

  return (
    <>
      <div className="ds-row">
        <FilterButton
          value={filters}
          onApply={setFilters}
          onClear={() => setFilters(getInitialFiltersState())}
        />
        <WeekFilter weekLabel="Week 1" totalWeeks={4} />
      </div>
      <Form>
        <FilterByDate value={filters} onChange={onChange} />
        <DayPicker name="day" value={[sampleDate, sampleDate]} />
        <MonthPicker name="month" value={[sampleDate, sampleDate]} />
        <RangePicker name="range" value={[sampleDate, sampleDate]} />
      </Form>
    </>
  );
}

function FormsSample() {
  return (
    <>
      <Form fluid>
        <InputField name="name" label="Name" />
        <InputNumberField name="products" label="Products" />
        <TextAreaField name="notes" label="Notes" />
        <SelectField
          name="city"
          label="City"
          data={[
            {label: 'Abuja', value: 'abuja'},
            {label: 'Lagos', value: 'lagos'},
          ]}
        />
        <BooleanSelectField name="active" label="Active" />
        <WeekSelectField name="week" label="Week" />
        <AutoCompleteField name="search-name" label="Find a name" data={['Ada', 'Bola', 'Chidi']} />
        <CheckboxGroupField
          name="days"
          label="Days"
          inline
          data={[
            {value: 'mon', label: 'Mon'},
            {value: 'tue', label: 'Tue'},
          ]}
        />
        <RadioGroupField
          name="shift"
          label="Shift"
          inline
          data={[
            {value: 'morning', label: 'Morning'},
            {value: 'night', label: 'Night'},
          ]}
        />
        <DatePickerField name="when" label="Date" />
        <ToggleField name="shared" label="Shared order" description="Allow extra products" />
        <PictureField name="photo" label="Photo" onSelect={() => undefined} />
      </Form>
      <SearchInput placeholder="Search people" />
      <MultiForm
        title="People"
        subtitle="Add one person at a time."
        filename="people"
        headers={personHeaders}
        renderItem={item => item.name}
        Form={SampleSingleForm}
        submit={async () => ({})}
      />
      <WizardForm
        steps={['details']}
        config={{details: {title: 'Details', subtitle: 'A single sample step'}}}
        getSchema={() => wizardSchema}
        getComponent={() => WizardStep}
        onSave={() => undefined}
        onCancel={() => undefined}
      />
      <Complete
        message="All records saved."
        reset={() => undefined}
        headers={personHeaders}
        records={[{name: 'Ada'}]}
        filename="people"
      />
      <RowError data={{name: ['Name is required'], __all__: ['Check the form.']}} />
    </>
  );
}

function TableSample() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  return (
    <>
      <TableView data={tableRows} headers={tableHeaders} rowKey="id" />
      <div className="ds-row">
        <ExportButton data={tableRows} headers={tableHeaders} exportFileName="people" />
        <Pagination
          total={24}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onLimitChange={setPageSize}
        />
      </div>
      <Empty />
    </>
  );
}

export default function DesignSystem() {
  const iconNames = [...new Set(Object.values(IconName))];

  return (
    <main className="design-system">
      <h1>Design system</h1>
      <p className="ds-intro">Every component currently in the core library.</p>
      <nav className="ds-nav">
        {sections.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>

      <Section id="actions" title="Actions">
        <ActionsList
          variant="buttons"
          actions={[
            {key: 'edit', label: 'Edit', iconName: IconName.Edit, onClick: () => undefined},
          ]}
        />
      </Section>

      <Section id="alerts" title="Alerts">
        <div className="ds-row">
          {['success', 'info', 'warning', 'error'].map(mode => (
            <AlertIcon key={mode} mode={mode} />
          ))}
        </div>
      </Section>

      <Section id="badges" title="Badges">
        <div className="ds-row">
          <Badge value="Sage" bgColor="#5c7a3a" color="#fff" />
          <Badge value="Small" size="sm" bgColor="#eaf3d7" color="#3d5122" />
          <Badge value="With icon" icon={<Icon name={IconName.Ok} />} />
        </div>
      </Section>

      <Section id="charts" title="Charts">
        <SampleBoundary>
          <div className="ds-row">
            <div className="ds-chart">
              <VerticalBarChart data={chartData} bars={chartSeries} height={240} width={360} />
            </div>
            <div className="ds-chart">
              <HorizontalBarChart data={chartData} bars={chartSeries} height={240} width={360} />
            </div>
            <div className="ds-chart">
              <VerticalLineChart data={chartData} lines={chartSeries} height={240} width={360} />
            </div>
            <div className="ds-chart">
              <HorizontalLineChart data={chartData} lines={chartSeries} height={240} width={360} />
            </div>
            <div className="ds-chart">
              <PieChart data={pieData} height={240} width={280} />
            </div>
            <div className="ds-chart">
              <DoughnutChart
                title="Fleet"
                subtitle="Today"
                data={pieData}
                height={240}
                width={280}
              />
            </div>
          </div>
        </SampleBoundary>
      </Section>

      <Section id="fields" title="Fields">
        <Field key="depot" label="Depot" value="Abuja" />
      </Section>

      <Section id="filters" title="Filters">
        <FiltersSample />
      </Section>

      <Section id="forms" title="Forms">
        <FormsSample />
      </Section>

      <Section id="formatted" title="Formatted values">
        <div className="ds-row">
          <NumberValue value={1280.5} />
          <MeasurementValue value={42} uom="km" />
          <DateValue value={sampleDate} />
          <TimeValue value={sampleDate} />
          <DateTimeValue value={sampleDate} inline />
          <RelativeTimeValue value={sampleDate} />
          <TaggedNumberValue tag={{key: 'products', icon: IconName.Add}} value={12} />
          <TaggedNumberValues
            tags={[
              {key: 'gold', icon: IconName.Ok},
              {key: 'silver', icon: IconName.Info},
            ]}
            values={{gold: 3, silver: 5}}
          />
          <CoordinatesValue latitude={9.0765} longitude={7.3986} />
          <ListValues value={['Ada', 'Bola', 'Chidi']} />
        </div>
      </Section>

      <Section id="icons" title="Icons">
        <div className="ds-icons">
          {iconNames.map(name => (
            <div className="ds-icon" key={name}>
              <Icon name={name} />
              <span>{name}</span>
            </div>
          ))}
        </div>
        <InitialsAvatar name="Ada Lovelace" />
      </Section>

      <Section id="states" title="States">
        <IsLoading isLoading loadingMessage="Loading orders" />
        <NotFound message="No order matches that search." />
        <Forbidden message="This sample is locked." />
        <Wip />
      </Section>

      <Section id="panels" title="Panels">
        <Picture picture={samplePicture} />
        <TabbedPanel
          id="sample"
          filename="sample"
          defaultTab="overview"
          getTabPath={tab => `/~design-system/${tab}`}
          tabs={{
            overview: {
              name: defineMessage({id: 'ds.overview', defaultMessage: 'Overview'}),
              component: TabOne,
            },
            details: {
              name: defineMessage({id: 'ds.details', defaultMessage: 'Details'}),
              component: TabTwo,
            },
          }}
        />
      </Section>

      <Section id="table" title="Table">
        <TableSample />
      </Section>

      <Section id="toast" title="Toast">
        <Toast mode={ToastMode.Success} tag={ToastTag.Message}>
          Order saved.
        </Toast>
      </Section>
    </main>
  );
}
