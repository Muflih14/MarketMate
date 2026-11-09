import Input, {type InputProps} from 'rsuite/Input';
import InputGroup from 'rsuite/InputGroup';

import {Icon, IconName} from '../../icon';

type Props = Omit<InputProps, 'inputRef'>;

const SearchInput = (props: Props) => {
  return (
    <InputGroup inside>
      <Input {...props} />

      <InputGroup.Button>
        <Icon name={IconName.Search} />
      </InputGroup.Button>
    </InputGroup>
  );
};

export default SearchInput;
