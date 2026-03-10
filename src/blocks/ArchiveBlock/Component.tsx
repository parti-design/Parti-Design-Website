/**
 * ArchiveBlock — simplified stub.
 * Previously fetched from Payload's posts collection.
 * Now stubbed since there is no block-level post archive in Keystatic content.
 * TODO: Re-implement if needed using queryAllPosts() from keystatic-queries.
 */
import React from 'react'

export const ArchiveBlock: React.FC<{
  id?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}> = ({ id }) => {
  return (
    <div className="my-16" id={`block-${id}`}>
      {/* TODO: Re-implement archive block with Keystatic data */}
    </div>
  )
}
