const Header = ({name}) => <h2>{name}</h2>

const Total = ({parts}) => {
  
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)

  return(
    <p>
      <strong>
        Total of {total} exercises 
      </strong>
    </p>
  )
}
  
const Part = ({part}) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part => 
      <Part key={part.id} part={part}/>
    )}
  </>

const Course = ({courses, id}) => {

    const course = courses.find(course => course.id === id)

    return (
        <>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}


export default Course