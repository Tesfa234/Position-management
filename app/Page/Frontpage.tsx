import {
  ActionIcon,
  Button,
  AppShell,
  Container,
  Group,
  Text,
  Flex,
  Modal,
  MantineProvider,
  Title,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import Navbar from "./Navbar";
import EmployeeForm, { Employee } from "../components/Employeeform";
import PositionRegistration from "../components/PositionForm";
import EmployeeList from "../components/Employeelist";
import PositionList from "../components/PositionList";
import Positiontree from "./Treecomponent";
import { Notifications } from "@mantine/notifications";
import Footer from "./footer";

export default function Frontpage() {
  const [opened, { toggle }] = useDisclosure();
  const [navbarOpened, { toggle: toggleNavbar }] = useDisclosure(true); // Set initial state to true
  const [modalState, setModalState] = useState<{
    employeeForm: boolean;
    positionForm: boolean;
    showEmployeeList: boolean;
    showPositionList: boolean;
  }>({
    employeeForm: false,
    positionForm: false,
    showEmployeeList: false,
    showPositionList: false,
  });

  const openModal = (modal: keyof typeof modalState) => {
    setModalState({
      employeeForm: false,
      positionForm: false,
      showEmployeeList: false,
      showPositionList: false,
      [modal]: true,
    });
  };

  const closeAllModals = () => {
    setModalState({
      employeeForm: false,
      positionForm: false,
      showEmployeeList: false,
      showPositionList: false,
    });
  };

  const handleHomeClick = () => {
    closeAllModals();
    
  };

  return (
    <MantineProvider>
      <Notifications />
      <AppShell
        padding="md"
        navbar={{
          width: navbarOpened ? 350 : 0,
          breakpoint: 'lg', 
        }}
        header={{ height: 60 }}
      >
        <AppShell.Header className="flex justify-center">
          <Flex justify="space-between" align={"center"}>
            <Group h="100%" px="md">
              <Navbar
                onRegisterClick={() => openModal("employeeForm")}
                onListClick={() => openModal("showEmployeeList")}
                onPositionregistration={() => openModal("positionForm")}
                onPositionlist={() => openModal("showPositionList")}
                onHomeClick={handleHomeClick} // Pass the handler for home click
              />
            </Group>
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar
          p="lg"
          className={`scrollable-navbar transition-width duration-300 ease-in-out ${
            navbarOpened ? "w-64" : "w-0"
          } overflow-y-auto max-h-[calc(100vh-60px)]`}
        >
          <Box className="flex justify-end">
          <ActionIcon
            onClick={toggleNavbar}
            size="lg"
            className=" absolute right-0 top-0 mt-2 mr-2 z-10 "
          >
            {navbarOpened ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </ActionIcon>
          </Box>
          {navbarOpened && (
            <>
              <Text size="xl">Positions</Text>
              <Positiontree />
            </>
          )}
          
        </AppShell.Navbar>

        <AppShell.Main>
          {modalState.showEmployeeList && (
            <EmployeeList onClose={closeAllModals} />
          )}
          {modalState.showPositionList && (
            <PositionList onClose={closeAllModals} />
          )}

          {!modalState.showEmployeeList && !modalState.showPositionList && (
            <>
              <Group>
                <img
                  src="https://www.peragosystems.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fperago-white.3170b248.png&w=3840&q=75"
                  alt="Perago Systems Logo"
                  className="h-10"
                />
                <Title order={1}>Systems</Title>
              </Group>

              <Container className="text-gray-600 body-font h-full" size="lg">
                <Flex className="flex-col items-center px-5 py-24 mx-auto md:flex-row">
                  <Flex className="flex-col items-center mb-16 text-center lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 md:items-start md:text-left md:mb-0">
                    <Text className="mb-4 font-bold text-gray-900 title-font sm:text-4xl text-9xl">
                      We are Building Things For Future
                    </Text>
                    <Text className="mb-8 leading-relaxed">
                      Worked with clients internationally and nationally,
                      including top-tier firms. Provided them with the best
                      technology - modern, scalable, and adaptive.
                    </Text>
                    <Flex className="justify-center">
                      <Button className="inline-flex px-6 py-2 text-lg text-white bg-blue-500 rounded-lg border-1 focus:outline-none hover:bg-blue-600">
                        Contact Us
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </Container>
              <Footer/>
            </>
          )}
        </AppShell.Main>

        <Modal
          opened={modalState.employeeForm}
          onClose={closeAllModals}
          title="Employee Form"
          size="lg"
        >
          <EmployeeForm
            onClose={closeAllModals}
            onSave={function (updatedEmployee: Employee): Promise<void> {
              throw new Error("Function not implemented.");
            }}
          />
        </Modal>

        <Modal
          opened={modalState.positionForm}
          onClose={closeAllModals}
          title="Position Registration"
          size="lg"
        >
          <PositionRegistration
            onClose={closeAllModals}
            opened={true}
            onSave={function (updatedPosition: {
              id: string;
              position: string;
              parentPosition: string | null;
              parentPositionId: string | null;
            }): Promise<void> {
              throw new Error("Function not implemented.");
            }}
          />
        </Modal>
      </AppShell>
    </MantineProvider>
  );
}
