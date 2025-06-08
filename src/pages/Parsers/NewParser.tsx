import { ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'

export default function NewParser() {
  return (
    <div className="px-4 pt-6 sm:px-6 lg:px-8">
      {/* Breadcrumb + Heading */}
      <div>
        {/* Mobile Back */}
        <nav aria-label="Back" className="sm:hidden">
          <Link to="/parsers" className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200">
            <ChevronLeftIcon className="mr-1 -ml-1 size-5 shrink-0 text-gray-500" aria-hidden="true" />
            Back
          </Link>
        </nav>

        {/* Desktop Breadcrumb */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <Link to="/parsers" className="text-sm font-medium text-gray-400 hover:text-gray-200">
                  Parsers
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="size-5 shrink-0 text-gray-500" aria-hidden="true" />
                <span className="ml-4 text-sm font-medium text-gray-400">Add New Parser</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Form Box */}
      <form className="mt-10 m-auto max-w-280 rounded-2xl border border-white/10 px-6 pt-6 pb-8 shadow">
        <div className="space-y-12">
          <div className="border-b border-white/10 pb-12">
            <h3 className="text-xl font-semibold text-white">New Log Parser</h3>
            <p className="mt-1 text-sm text-gray-400">
              Add a new parser by specifying its name and uploading the corresponding Python file.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-6">
              {/* Parser Name */}
              <div className="sm:col-span-4">
                <label htmlFor="parser-name" className="block text-sm font-medium text-white">
                  Parser Name
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                    
                    <input
                      id="parser-name"
                      name="parser-name"
                      type="text"
                      placeholder="Example-parser"
                      className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="col-span-full">
                <label htmlFor="file-upload" className="block text-sm font-medium text-white">
                  Upload .py Parser Code
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-4 py-10">
                  <div className="text-center">
                    <DocumentTextIcon aria-hidden="true" className="mx-auto size-12 text-purple-500" />
                    <div className="mt-4 flex text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white hover:text-indigo-500"
                      >
                        <span className='text-purple-500'>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">.py code file</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link to='/Parsers'>
            <button type="button" className="rounded-md bg-grey-950 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700">
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="rounded-md bg-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
