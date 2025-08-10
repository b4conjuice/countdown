'use client'

import { useState } from 'react'
import { Cog6ToothIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  format,
  formatDuration,
  intervalToDuration,
  isPast,
} from 'date-fns'

import { Main, Title } from '@/components/ui'
import useLocalStorage from '@/lib/useLocalStorage'
import Modal from '@/components/modal'
import Button from '@/components/button'

function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return array.reduce(
    (acc: [T[], T[]], item: T) => {
      if (predicate(item)) {
        acc[0].push(item) // Add to the 'truthy' array
      } else {
        acc[1].push(item) // Add to the 'falsy' array
      }
      return acc
    },
    [[], []] // Initialize with two empty arrays of type T[]
  )
}

type Countdown = {
  name: string
  date: Date
}

function AddCountdown({
  addCountdown,
}: {
  addCountdown: (countdown: Countdown) => void
}) {
  const today = new Date()
  const [name, setName] = useState('')
  const [date, setDate] = useState(format(today, 'yyyy-MM-dd'))
  return (
    <div className='flex flex-col space-y-4'>
      <input
        type='text'
        className='bg-cobalt'
        placeholder='name'
        value={name}
        onChange={e => {
          setName(e.target.value)
        }}
      />
      <input
        type='date'
        className='bg-cobalt'
        value={date}
        onChange={e => {
          setDate(e.target.value)
        }}
      />
      <Button
        onClick={() => {
          const [year, month, day] = date.split('-')
          const newDate = new Date(Number(year), Number(month) - 1, Number(day))
          addCountdown({ name, date: newDate })
          setName('')
          setDate('')
        }}
        disabled={!name || !date}
        className='disabled:pointer-events-none disabled:opacity-50'
      >
        add
      </Button>
    </div>
  )
}

const getDaysLeft = (date: Date) => {
  const now = new Date()
  const diffMs = differenceInMilliseconds(date, now)
  if (diffMs <= 0) {
    return "it's finally here!"
  }
  const duration = intervalToDuration({ start: now, end: date })
  return `${formatDuration(duration)} left`
}

function DaysLeft({ date }: { date: Date }) {
  const now = new Date()
  const differenceDays = differenceInDays(date, now)
  const differencesHours = differenceInHours(date, now)
  const differencesHoursRounded = Math.ceil(
    differenceInHours(date, new Date()) / 24
  )
  if (differencesHoursRounded < 0) {
    return (
      <div>
        {Math.abs(differencesHoursRounded)} day
        {differencesHoursRounded === 1 ? '' : 's'} ago
      </div>
    )
  }
  return (
    <>
      {/* <div>
        {differenceDays} day{differenceDays === 1 ? '' : 's'} left
      </div>
      <div>
        {differencesHours} hour{differencesHours === 1 ? '' : 's'} left
      </div> */}
      <div>
        {differencesHoursRounded} day{differencesHoursRounded === 1 ? '' : 's'}{' '}
        left
      </div>
      {/* <div>{getDaysLeft(date)}</div> */}
    </>
  )
}

export default function Home() {
  const [countdowns, setCountdowns] = useLocalStorage<Countdown[]>(
    'cd-countdowns',
    []
  )
  const addCountdown = (countdown: Countdown) => {
    setCountdowns([...countdowns, countdown])
    setIsAddModalOpen(false)
  }
  const deleteCountdown = (index: number) => {
    const countdownsCopy = [...countdowns]
    countdownsCopy.splice(index, 1)
    setCountdowns(countdownsCopy)
  }
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedCountdownIndex, setSelectedCountdownIndex] = useState<
    number | null
  >(null)
  const [pastCountdowns, futureOrPresentCountdowns] = partition(
    countdowns ?? [],
    countdown => isPast(countdown.date)
  )
  return (
    <>
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <Title>countdown</Title>
          <h2 className='text-cb-orange'>upcoming</h2>
          {futureOrPresentCountdowns?.length > 0 ? (
            <ul className='divide-cb-dusty-blue flex flex-col divide-y'>
              {futureOrPresentCountdowns
                .sort((a, b) => (a.date < b.date ? -1 : 1))
                .map((countdown, index) => (
                  <li key={index} className='py-4 first:pt-0 last:pb-0'>
                    <div className='flex justify-between'>
                      <div>
                        <div>
                          {countdown.name} -{' '}
                          {format(countdown.date, 'MMM d, yyyy')}
                        </div>
                        <DaysLeft date={countdown.date} />
                      </div>
                      <button
                        type='button'
                        onClick={() => {
                          setSelectedCountdownIndex(index)
                          setIsConfirmModalOpen(true)
                        }}
                      >
                        <TrashIcon className='h-6 w-6 text-red-700' />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p>no upcoming countdowns</p>
          )}
          <h2 className='text-cb-orange'>past</h2>
          {pastCountdowns?.length > 0 ? (
            <ul className='divide-cb-dusty-blue text-cb-white/50 flex flex-col divide-y'>
              {pastCountdowns
                .sort((a, b) => (a.date < b.date ? -1 : 1))
                .map((countdown, index) => (
                  <li key={index} className='py-4 first:pt-0 last:pb-0'>
                    <div className='flex justify-between'>
                      <div>
                        <div>
                          {countdown.name} -{' '}
                          {format(countdown.date, 'MMM d, yyyy')}
                        </div>
                        <DaysLeft date={countdown.date} />
                      </div>
                      <button
                        type='button'
                        onClick={() => {
                          setSelectedCountdownIndex(index)
                          setIsConfirmModalOpen(true)
                        }}
                      >
                        <TrashIcon className='h-6 w-6 text-red-700' />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p>no past countdowns</p>
          )}
        </div>
      </Main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          {/* <button
            className='text-cb-yellow hover:text-cb-yellow/75'
            type='button'
            onClick={() => {
              // TODO
            }}
          >
            <Cog6ToothIcon className='h-6 w-6' />
          </button> */}
        </div>
        <div className='flex space-x-4'>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75'
            type='button'
            onClick={() => {
              setIsAddModalOpen(true)
            }}
          >
            <PlusIcon className='h-6 w-6' />
          </button>
        </div>
      </footer>
      <Modal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        title='add new countdown'
      >
        <AddCountdown addCountdown={addCountdown} />
      </Modal>
      {selectedCountdownIndex !== null && (
        <Modal
          isOpen={isConfirmModalOpen}
          setIsOpen={setIsConfirmModalOpen}
          title='are you sure you want to delete'
        >
          <div className='flex space-x-4'>
            <Button
              onClick={() => {
                deleteCountdown(selectedCountdownIndex)
                setIsConfirmModalOpen(false)
              }}
            >
              yes
            </Button>
            <Button
              onClick={() => {
                setIsConfirmModalOpen(false)
              }}
            >
              no
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
