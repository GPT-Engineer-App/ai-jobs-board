import { useState, useEffect } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Image, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const KVDB_URL = "https://kvdb.io/BLbtbuWvN1B5uCxdV8Nzk6/";

const Index = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch(KVDB_URL + "jobs:");
    const data = await res.json();
    setJobs(data);
  };

  const addJob = async (job) => {
    await fetch(KVDB_URL + "jobs:", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    fetchJobs();
    onClose();
    toast({
      title: "Job added",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const updateJob = async (job) => {
    await fetch(KVDB_URL + "jobs:" + job.key, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    fetchJobs();
    onClose();
    toast({
      title: "Job updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteJob = async (key) => {
    await fetch(KVDB_URL + "jobs:" + key, {
      method: "DELETE",
    });
    fetchJobs();
    toast({
      title: "Job deleted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <Heading mb={4}>AGI Jobs</Heading>

      <Button
        leftIcon={<FaPlus />}
        mb={4}
        onClick={() => {
          setEditingJob(null);
          onOpen();
        }}
      >
        Add Job
      </Button>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>URL</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {jobs.map((job) => (
              <Tr key={job.key}>
                <Td>{job.title}</Td>
                <Td>{job.description}</Td>
                <Td>
                  <a href={job.url} target="_blank" rel="noreferrer">
                    {job.url}
                  </a>
                </Td>
                <Td>
                  <IconButton
                    icon={<FaEdit />}
                    mr={2}
                    onClick={() => {
                      setEditingJob(job);
                      onOpen();
                    }}
                  />
                  <IconButton icon={<FaTrash />} onClick={() => deleteJob(job.key)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingJob ? "Edit Job" : "Add Job"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src="https://source.unsplash.com/random/?portrait%20professional" mb={4} />
            <FormControl id="title" mb={4}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                defaultValue={editingJob?.title}
                ref={(input) => {
                  if (input && editingJob) {
                    input.value = editingJob.title;
                  }
                }}
              />
            </FormControl>
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                defaultValue={editingJob?.description}
                ref={(input) => {
                  if (input && editingJob) {
                    input.value = editingJob.description;
                  }
                }}
              />
            </FormControl>
            <FormControl id="url">
              <FormLabel>URL</FormLabel>
              <Input
                type="text"
                defaultValue={editingJob?.url}
                ref={(input) => {
                  if (input && editingJob) {
                    input.value = editingJob.url;
                  }
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                const title = document.getElementById("title").value;
                const description = document.getElementById("description").value;
                const url = document.getElementById("url").value;
                if (editingJob) {
                  updateJob({ ...editingJob, title, description, url });
                } else {
                  addJob({ title, description, url });
                }
              }}
            >
              {editingJob ? "Update" : "Add"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Index;
