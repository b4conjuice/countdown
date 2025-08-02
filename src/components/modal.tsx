import type { Dispatch, SetStateAction } from 'react'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'

export default function Modal({
  isOpen,
  setIsOpen,
  title,
  children,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  title?: string
  children: React.ReactNode
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        onClose={setIsOpen}
        className='fixed inset-0 flex flex-col justify-end overflow-y-auto p-4'
      >
        <Transition.Child
          enter='duration-300 ease-out'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='duration-200 ease-in'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='bg-cobalt/90 fixed inset-0' />
        </Transition.Child>
        <Transition.Child
          enter='duration-300 ease-out'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='duration-200 ease-in'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <Dialog.Panel className='dark:bg-cb-dusty-blue relative z-10 rounded-lg p-4 dark:text-gray-100'>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='absolute top-4 right-4'
            >
              <XMarkIcon className='text-cb-yellow h-6 w-6' />
            </button>
            <div className='space-y-3'>
              {title && (
                <Dialog.Title className='mt-4 text-center text-xl'>
                  {title}
                </Dialog.Title>
              )}
              {children}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}
