'use client'
import React, { useEffect } from 'react'
import SpaceCard from './SpaceCard'
import { useSpace } from '@/context/SpaceContext'
import { Empty, Skeleton } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const SpaceList = () => {
  const { spaceList, loading, loadMore, loadingMore, total, reload } = useSpace()

  useEffect(() => {
    reload()
  }, [])

  return (
    <div>
      <>
        {loading ? (
          <Skeleton
            active
            style={{
              width:
                window.innerWidth >= 1536
                  ? '73.76rem'
                  : window.innerWidth >= 1280
                    ? '58.82rem'
                    : window.innerWidth >= 1024
                      ? '43.88rem'
                      : window.innerWidth >= 768
                        ? '28.94rem'
                        : '14.94rem',
            }}
          />
        ) : spaceList.length === 0 ? (
          <Empty
            style={{
              width:
                window.innerWidth >= 1536
                  ? 1164
                  : window.innerWidth >= 1280
                    ? 926
                    : window.innerWidth >= 1024
                      ? 687
                      : window.innerWidth >= 768
                        ? 448
                        : '14.94rem',
            }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[.94rem]">
            {spaceList.map((item) => {
              return <SpaceCard data={item} key={item.tick} />
            })}
          </div>
        )}
      </>
      {spaceList.length < total && spaceList.length >= 15 && total >= 15 && !loading && (
        <div className="mt-[1.5rem] flex items-center justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="w-[10.25rem] h-[2.5rem] rounded-[1.25rem] border-[1px] border-solid border-[#E6E7EB] text-[#202020] font-medium hover:border-none"
          >
            {loadingMore ? (
              <div className="w-full h-full flex items-center justify-center rounded-[1.25rem]">
                <LoadingOutlined style={{ color: '#ecbf42' }} />
              </div>
            ) : (
              <div className="hover:bg-[#F5BD07] w-full h-full flex items-center justify-center rounded-[1.25rem]">
                Load More
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default SpaceList
