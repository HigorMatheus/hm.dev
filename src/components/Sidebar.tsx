import {gql, useQuery} from '@apollo/client';
import React from 'react';
import {Lesson} from './Lesson';

const GET_LESSONS_QUERY = gql`
	query  {
		lessons(orderBy: availableAt_ASC, stage: PUBLISHED) {
			id
			lessonType
			slug
			availableAt
			title
		}
	}
`;

interface IGetLessonsQueryResponse  {
	lessons: Array<{
		id: string;
		availableAt: string;
		lessonType: 'live' | 'class';
		slug:	string;
		title: string;

	}>;
}
export function Sidebar() {
	const { data 
	
	
	
	} = useQuery<IGetLessonsQueryResponse>(GET_LESSONS_QUERY);
	console.log({data});

	return (
		<aside className='w-[348px] bg-gray-700 p-6 border-l border-gray-600'>
			<span className='font-bold text-2xl pb-6 mb-6 border-b border-gray-500 block'> Cronograma de aulas
			</span>

			<div className='flex flex-col gap-8'>
				{data?.lessons?.map(lesson => (
					<Lesson
						key={lesson?.id}
						availableAt={new Date(lesson?.availableAt)}
						slug={lesson?.slug}
						title={lesson.title}
						type={lesson?.lessonType} />
				))}

				{/* <Lesson/> */}
				{/* <Lesson/>
				<Lesson/>
				<Lesson/>
				<Lesson/>
				<Lesson/> */}
			</div>
		</aside>
	);
}
