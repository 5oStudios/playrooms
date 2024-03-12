import React, { useEffect } from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Divider,
  Input,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import BaseModal from './base.modal';

export const ExternalPlatformsModal = ({
  supportedPlatforms,
  isOpen,
  onClose,
  parentForm,
}: {
  supportedPlatforms: {
    id: string;
    title: string;
    logo: string;
    description: string;
    active: boolean;
  }[];
  isOpen: boolean;
  onClose: () => void;
  parentForm: UseFormReturn<
    {
      questionsCollectionId: string;
      maxPlayers: string;
      externalPlatforms: any[];
      allowThisPlatform: boolean;
    },
    any,
    {
      questionsCollectionId: string;
      maxPlayers: string;
      externalPlatforms: any[];
      allowThisPlatform: boolean;
    }
  >;
}) => {
  const parentFormValues = parentForm.getValues();
  console.log('parentFormValues', parentFormValues);
  const _externalPlatforms = useForm({
    context: parentForm,
    defaultValues: {
      _externalPlatforms: parentFormValues.externalPlatforms,
    },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: '_externalPlatforms',
      control: _externalPlatforms.control,
    }
  );
  const [isDirty, setIsDirty] = React.useState(false);
  console.log('fields', fields);
  const externalPlatformsLength = fields.length;

  if (externalPlatformsLength === 0 && !isDirty) {
    append({});
  }

  // useEffect(() => {
  //   if (parentFormValues.externalPlatforms.length > 0) {
  //     _externalPlatforms.setValue(
  //       '_externalPlatforms',
  //       parentFormValues.externalPlatforms
  //     );
  //   }
  // }, [_externalPlatforms, append, parentFormValues.externalPlatforms]);

  // Clean up
  useEffect(() => {
    return () => {
      _externalPlatforms.reset();
    };
  }, [_externalPlatforms]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={_externalPlatforms.handleSubmit((data) => {
          parentForm.setValue('externalPlatforms', data._externalPlatforms);
          onClose();
        })}
      >
        <ModalContent className="gap-3">
          <ModalHeader>External Platforms</ModalHeader>
          {fields.map((_, index) => (
            <React.Fragment key={index}>
              <Controller
                name={`_externalPlatforms.${index}.id`}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                }}
                control={_externalPlatforms.control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    {...field}
                    defaultSelectedKey={field.value}
                    errorMessage={fieldState?.error?.message}
                    required
                    onSelectionChange={(value) => {
                      const selectedPlatform = supportedPlatforms.find(
                        (platform) => platform.id === value
                      );
                      _externalPlatforms.setValue(
                        `_externalPlatforms.${index}.label`,
                        selectedPlatform?.title
                      );
                      field.onChange(value);
                    }}
                    label="Supported Platforms"
                    placeholder="Select a platform"
                  >
                    {supportedPlatforms.map((platform) => (
                      <AutocompleteItem
                        startContent={
                          <Avatar
                            src={platform.logo}
                            className={'bg-transparent'}
                            size={'sm'}
                          />
                        }
                        key={platform.id}
                        value={platform.id}
                      >
                        {platform.title}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />
              <Controller
                name={`_externalPlatforms.${index}.username`}
                control={_externalPlatforms.control}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    errorMessage={fieldState?.error?.message}
                    label="Username"
                    placeholder="Enter your username"
                  />
                )}
              />
              <div className="flex gap-3 w-full">
                <Button
                  className={'w-full'}
                  color={'warning'}
                  onClick={() => {
                    console.log('Test Connection');
                  }}
                >
                  Test Connection
                </Button>
                <Button
                  className={'w-full'}
                  color={'danger'}
                  onClick={() => {
                    remove(index);
                    setIsDirty(true);
                  }}
                >
                  Remove
                </Button>
              </div>
              {index !== fields.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          <Divider />
          <Button
            className={'w-full'}
            onClick={() => {
              append({});
            }}
          >
            Add Platform
          </Button>
          <Button type={'submit'} className={'w-full'}>
            Save
          </Button>
        </ModalContent>
      </form>
    </BaseModal>
  );
};
