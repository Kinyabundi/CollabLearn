import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BookCheck } from 'lucide-react'
import {Lock } from 'lucide-react'




const NewProject = () => {
    return (
        <div className="flex items-center justify-center h-screen p-2">
            <div className='space-y-4'>
                <div>
                    <h2 className='text-2xl font-semibold text-gray-900'>Create New Project</h2>
                    <p className='text-sm italic font-light '>Required fields are marked with an asterisk (*).</p>
                </div>
                <div className='flex flex-row gap-3'>
                    <div className='flex flex-col mt-1'>
                        <p className='font-semibold text-sm'>Owner</p>
                        <Button className=''>Connect Wallet</Button>
                    </div>
                    <div>
                        <Label htmlFor="projectName" className='font-semibold text-sm'>Project Name</Label>
                        <Input id="projectName" type="text" />
                    </div>
                </div>
                <div>
                    <Label htmlFor='description' className='font-semibold text-sm'>Description</Label>
                    <Input />
                </div>
                <hr />
                <div className=''>
                    <RadioGroup defaultValue="comfortable">
                        <div className="flex items-center space-x-4 space-y-3">
                            <RadioGroupItem value="public" id="r1" />
                            <BookCheck size={30} />
                            <div className='flex flex-col'>
                                <Label htmlFor="r1" className="font-bold">Public</Label>
                                <p className='font-light italic'>Anyone on the internet can see this project. You choose who can contributes</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 space-y-3">
                            <RadioGroupItem value='private' id="r2" />
                            <Lock  size={30} />
                            <div className='flex flex-col'>
                                <Label htmlFor="r1" className='font-bold'>Private</Label>
                                <p className='font-light italic'>You choose who can see and commit to this project.
                                </p>
                            </div>
                        </div>
                    </RadioGroup>

                </div>

                <div>
                    <Label htmlFor='description' className='font-semibold text-sm'>Area of Study</Label>
                    <Input />
                </div>
            <Button> Create Project</Button>

            </div>

        </div>
    )
}

export default NewProject
