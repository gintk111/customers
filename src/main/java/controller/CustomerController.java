package controller;

import exeption.NotFoundException;
import model.Customer;
import model.CustomerImage;
import model.Province;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import service.customer.CustomerService;
import service.provice.ProvinceService;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/customers")
public class CustomerController {


    @Autowired
    private Environment environment;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ProvinceService provinceService;

    @ExceptionHandler(NotFoundException.class)
    public ModelAndView showInputNotAcceptable() {
        return new ModelAndView("/error/index");
    }

    @ModelAttribute("provinces")
    public Iterable<Province> provinces(){
        return provinceService.findAll();
    }

    @GetMapping("")
    public ModelAndView showList(@RequestParam("name") Optional<String> name,@PageableDefault(size = 10) Pageable pageable){
        Page<Customer> customers;
        if(name.isPresent()){
            customers = customerService.findAllByFirstNameContaining(name.get(), pageable);
        } else {
            customers = customerService.findAll(pageable);
        }
        ModelAndView modelAndView = new ModelAndView("/customer/list");
        modelAndView.addObject("customers", customers);
        return modelAndView;
    }

    @GetMapping("/create-customer")
    public ModelAndView showCreateForm(){
        ModelAndView modelAndView = new ModelAndView("/customer/create");
        modelAndView.addObject("customer", new CustomerImage());
        return modelAndView;
    }

    @PostMapping("/create-customer")
    public ModelAndView saveCustomer(@ModelAttribute CustomerImage customerImg){
        Customer customer = new Customer(customerImg.getFirstName(),customerImg.getLastName(),customerImg.getProvince());
        MultipartFile file = customerImg.getImage();
        String image = file.getOriginalFilename();
        customer.setImage(image);
        String fileUpload = environment.getProperty("file_upload").toString();
        try {
            FileCopyUtils.copy(file.getBytes(), new File(fileUpload + image));
        } catch (IOException e) {
            e.printStackTrace();
        }
        customerService.save(customer);
        ModelAndView modelAndView = new ModelAndView("/customer/create");
        modelAndView.addObject("customer", new CustomerImage());
        modelAndView.addObject("message", "New customer created successfully");
        return modelAndView;
    }

    @GetMapping("/edit-customer/{id}")
    public ModelAndView showEditForm(@PathVariable Long id) throws NotFoundException {
        Customer customer = customerService.findById(id);
        ModelAndView modelAndView = new ModelAndView("/customer/update");
        modelAndView.addObject("customer", customer);
        return modelAndView;

    }

    @PostMapping("/edit-customer")
    public ModelAndView updateCustomer(@ModelAttribute CustomerImage customerImg) throws NotFoundException{
        Customer customer = customerService.findById(customerImg.getId());
        customer.setFirstName(customerImg.getFirstName());
        customer.setLastName(customerImg.getLastName());
        MultipartFile file = customerImg.getImage();
        String image ;
        if (file.isEmpty()){
            image = customer.getImage();
        } else {
            image = file.getOriginalFilename();
        }
        customer.setImage(image);
        String fileUpload = environment.getProperty("file_upload").toString();
        try {
            FileCopyUtils.copy(file.getBytes(), new File(fileUpload + image));
        } catch (IOException e) {
            e.printStackTrace();
        }
        customerService.save(customer);
        ModelAndView modelAndView = new ModelAndView("/customer/update");
        modelAndView.addObject("customer", customer);
        modelAndView.addObject("message", "Customer updated successfully");
        return modelAndView;
    }

    @GetMapping("/delete-customer/{id}")
    public ModelAndView showDeleteForm(@PathVariable Long id, Pageable pageable) throws NotFoundException{
        Customer customer = customerService.findById(id);
        customerService.remove(customer.getId());
        Page<Customer> customers = customerService.findAll(pageable);
        ModelAndView modelAndView = new ModelAndView("/customer/list");
        modelAndView.addObject("customers", customers);
        customerService.remove(customer.getId());
        return modelAndView;
    }
}
