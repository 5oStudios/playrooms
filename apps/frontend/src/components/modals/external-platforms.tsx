import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
  parentForm: any;
}) => {
  const supportedPlatformsForm = useForm({
    defaultValues: {
      externalPlatforms: [{ id: '', label: '', username: '' }],
    },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: supportedPlatformsForm.control,
      name: 'externalPlatforms',
    }
  );
  console.log('fields', fields);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={supportedPlatformsForm.handleSubmit((data) => {
          parentForm.setValue('externalPlatforms', data.externalPlatforms);
          onClose();
        })}
      >
        <ModalContent className="gap-3">
          <ModalHeader>External Platforms</ModalHeader>
          {fields.map((_, index) => (
            <React.Fragment key={index}>
              <Controller
                name={`externalPlatforms.${index}.id`}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                }}
                control={supportedPlatformsForm.control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    {...field}
                    errorMessage={fieldState?.error?.message}
                    required
                    onSelectionChange={(value) => {
                      const selectedPlatform = supportedPlatforms.find(
                        (platform) => platform.id === value
                      );
                      supportedPlatformsForm.setValue(
                        `externalPlatforms.${index}.label`,
                        selectedPlatform?.title
                      );
                      field.onChange(value);
                    }}
                    label="Supported Platforms"
                    placeholder="Select a platform"
                  >
                    {supportedPlatforms.map((platform) => (
                      <AutocompleteItem
                        variant={'faded'}
                        key={platform.id}
                        value={platform.id}
                        startContent={
                          <Avatar
                            size="sm"
                            className={'bg-transparent'}
                            src={platform.logo}
                          />
                        }
                      >
                        {platform.title}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />
              <Controller
                name={`externalPlatforms.${index}.username`}
                control={supportedPlatformsForm.control}
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
              append({ id: '', label: '', username: '' });
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
