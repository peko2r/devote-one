'use client'
import { DatePicker, Form, Input, Radio, Space, InputNumber } from 'antd'
import React, { useEffect, useState } from 'react'
import { Marked, Renderer } from '@ts-stack/markdown'
import hljs from 'highlight.js'
import './github-dark.css'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useSpace } from '@/context/SpaceContext'
import dayjs from 'dayjs'

type FieldType = {
  title: string
  description?: string
  options: Array<{ content: string }>
  vote_type: number
  snapshot_time: number
  start_time: number
  end_time: number
}

const AddForm = () => {
  useEffect(() => {
    // 配置highlight
    hljs.configure({
      classPrefix: 'hljs-',
      languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown'],
    })
    // 配置marked
    Marked.setOptions({
      renderer: new Renderer(),
      highlight: (code: any) => hljs.highlightAuto(code).value,
      gfm: true, //默认为true。 允许 Git Hub标准的markdown.
      tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
      breaks: true, //默认为false。 允许回车换行。该选项要求 gfm 为true。
    })
  }, [])

  const [text, setText] = useState('')
  const [counter, setCounter] = useState(0)
  const { setFields, fields: f } = useSpace()

  return (
    <Form name="basic" layout="vertical" initialValues={{ remember: true }} autoComplete="off">
      <Form.Item<FieldType>
        label={<div className="text-[#737373]">Title</div>}
        name="title"
        rules={[
          { required: true, message: 'Please input title!' },
          { max: 3000, message: 'The max length is 3000' },
        ]}
      >
        <Input
          placeholder="Please enter the title…"
          defaultValue={JSON.parse(localStorage?.getItem('fields') || '{}')?.title || ''}
          onChange={(e) => {
            setFields({ ...f, title: e.target.value })
            localStorage.setItem('fields', JSON.stringify({ ...f, title: e.target.value }))
          }}
        />
      </Form.Item>
      <Form.Item<FieldType>
        label={
          <div className="flex justify-between text-[#737373] w-[56.75rem]">
            <div>Description (optional)</div>
            <div className="text-[#9F9F9F]">{counter}/10000</div>
          </div>
        }
        name="description"
        rules={[{ message: 'The max length is 10,000', max: 10000 }]}
      >
        <Input.TextArea
          contentEditable="plaintext-only"
          defaultValue={JSON.parse(localStorage?.getItem('fields') || '{}')?.description || ''}
          onChange={(e) => {
            setText(e.target.innerText)
            setCounter(e.target.value.length)
            setFields({ ...f, description: e.target.value })
            localStorage.setItem('fields', JSON.stringify({ ...f, description: e.target.value }))
          }}
          placeholder="Please enter the description and rules…"
          autoSize={{ minRows: 8 }}
        />
      </Form.Item>
      <Form.Item<FieldType>
        name="options"
        rules={[{ required: true, message: 'Please input title!' }]}
        label={<div className="text-[#737373]">Vote Option</div>}
      >
        <Form.List
          name="options"
          initialValue={
            JSON.parse(localStorage?.getItem('fields') || '{}')?.options
              ? JSON.parse(localStorage.getItem('fields') || '{}').options.map((i: any) => i.content)
              : ['', '']
          }
        >
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                {fields.map(({ key, name, ...restField }, index) => {
                  return (
                    <Space key={key} style={{ display: 'flex', justifyContent: 'space-between' }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={name}
                        className="w-[880px]"
                        rules={[{ message: 'The max length is 1000', max: 1000 }]}
                      >
                        <Input
                          placeholder="Please enter vote options…"
                          onChange={(e) => {
                            setFields({
                              ...f,
                              options: f.options.map((item, ind) =>
                                ind === index ? { content: e.target.value } : item,
                              ),
                            })
                            localStorage.setItem(
                              'fields',
                              JSON.stringify({
                                ...f,
                                options: f.options.map((item, ind) =>
                                  ind === index ? { content: e.target.value } : item,
                                ),
                              }),
                            )
                          }}
                        />
                      </Form.Item>
                      {index === fields.length - 1 && fields.length === 100 ? null : index === fields.length - 1 ? (
                        <PlusCircleOutlined
                          onClick={() => {
                            add()
                            setFields({ ...f, options: [...f.options, { content: '' }] })
                            localStorage.setItem(
                              'fields',
                              JSON.stringify({ ...f, options: [...f.options, { content: '' }] }),
                            )
                          }}
                          className="text-xl"
                          style={{ color: '#9F9F9F' }}
                        />
                      ) : fields.length > 2 ? (
                        <MinusCircleOutlined
                          onClick={() => {
                            remove(name)
                            setFields({ ...f, options: f.options.filter((_, i) => i !== index) })
                            localStorage.setItem(
                              'fields',
                              JSON.stringify({ ...f, options: f.options.filter((_, i) => i !== index) }),
                            )
                          }}
                          className="text-xl"
                          style={{ color: '#9F9F9F' }}
                        />
                      ) : null}
                    </Space>
                  )
                })}
              </>
            )
          }}
        </Form.List>
      </Form.Item>
      <Form.Item<FieldType>
        label={<div className="text-[#737373]">Voting System</div>}
        name="vote_type"
        rules={[{ required: true, message: 'Please input vote type!' }]}
      >
        <Radio.Group
          defaultValue={JSON.parse(localStorage?.getItem('fields') || '{}')?.vote_type || undefined}
          onChange={(e) => {
            setFields({ ...f, vote_type: e.target.value })
            localStorage.setItem('fields', JSON.stringify({ ...f, vote_type: e.target.value }))
          }}
        >
          <Radio value={1} style={{ color: '#9F9F9F' }}>
            Single choice voting
          </Radio>
          <Radio value={2} style={{ color: '#9F9F9F' }}>
            Multiple choice voting
          </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item<FieldType>
        label={<div className="text-[#737373]">Snapshot Time</div>}
        name="snapshot_time"
        rules={[{ required: true, message: 'Please input block height!' }]}
      >
        {JSON.parse(localStorage?.getItem('fields') || '{}')?.snapshot_time ? (
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '22.5rem' }}
            defaultValue={dayjs.unix(JSON.parse(localStorage?.getItem('fields') || '{}')?.snapshot_time)}
            onChange={(e) => {
              setFields({ ...f, snapshot_time: Math.ceil(dayjs(e).valueOf() / 1000) })
              localStorage.setItem(
                'fields',
                JSON.stringify({ ...f, snapshot_time: Math.ceil(dayjs(e).valueOf() / 1000) }),
              )
            }}
          />
        ) : (
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '22.5rem' }}
            onChange={(e) => {
              setFields({ ...f, snapshot_time: Math.ceil(dayjs(e).valueOf() / 1000) })
              localStorage.setItem(
                'fields',
                JSON.stringify({ ...f, snapshot_time: Math.ceil(dayjs(e).valueOf() / 1000) }),
              )
            }}
          />
        )}
      </Form.Item>
      <Form.Item<FieldType>
        label={<div className="text-[#737373]">Start Time</div>}
        name="start_time"
        rules={[{ required: true, message: 'Please input start time!' }]}
      >
        {JSON.parse(localStorage?.getItem('fields') || '{}')?.start_time ? (
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '22.5rem' }}
            defaultValue={dayjs.unix(JSON.parse(localStorage?.getItem('fields') || '{}')?.start_time)}
            onChange={(e) => {
              setFields({ ...f, start_time: Math.ceil(dayjs(e).valueOf() / 1000) })
              localStorage.setItem('fields', JSON.stringify({ ...f, start_time: Math.ceil(dayjs(e).valueOf() / 1000) }))
            }}
          />
        ) : (
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '22.5rem' }}
            onChange={(e) => {
              setFields({ ...f, start_time: Math.ceil(dayjs(e).valueOf() / 1000) })
              localStorage.setItem('fields', JSON.stringify({ ...f, start_time: Math.ceil(dayjs(e).valueOf() / 1000) }))
            }}
          />
        )}
      </Form.Item>
      <Form.Item<FieldType>
        label={<div className="text-[#737373]">End Time</div>}
        name="end_time"
        rules={[{ required: true, message: 'Please input end time!' }]}
      >
        {JSON.parse(localStorage?.getItem('fields') || '{}')?.end_time ? (
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '22.5rem' }}
            defaultValue={dayjs.unix(JSON.parse(localStorage?.getItem('fields') || '{}')?.end_time)}
            onChange={(e) => {
              setFields({ ...f, end_time: Math.ceil(dayjs(e).valueOf() / 1000) })
              localStorage.setItem('fields', JSON.stringify({ ...f, end_time: Math.ceil(dayjs(e).valueOf() / 1000) }))
            }}
          />
        ) : (
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: '22.5rem' }}
            onChange={(e) => {
              setFields({ ...f, end_time: Math.ceil(dayjs(e).valueOf() / 1000) })
              localStorage.setItem('fields', JSON.stringify({ ...f, end_time: Math.ceil(dayjs(e).valueOf() / 1000) }))
            }}
          />
        )}
      </Form.Item>
    </Form>
  )
}

export default AddForm
