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
        })}
      >
        <ModalContent className="gap-3">
          <ModalHeader>External Platforms</ModalHeader>
          {fields.map((_, index) => (
            <React.Fragment key={index}>
              <Controller
                name={`externalPlatforms.${index}.id`}
                control={supportedPlatformsForm.control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
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
                    label="Allowed Platforms"
                    placeholder="Select a platform"
                  >
                    {supportedPlatforms.map((platform) => (
                      <AutocompleteItem
                        key={platform.id}
                        value={platform.id}
                        startContent={<Avatar size="sm" src={platform.logo} />}
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
                render={({ field }) => (
                  <Input
                    {...field}
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
          <Button
            className={'w-full'}
            onClick={() => {
              onClose();
              parentForm.setValue(
                'externalPlatforms',
                supportedPlatformsForm.getValues().externalPlatforms
              );
            }}
          >
            Save
          </Button>
        </ModalContent>
      </form>
    </BaseModal>
  );
};
